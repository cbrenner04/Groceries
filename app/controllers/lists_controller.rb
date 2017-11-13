# frozen_string_literal: true

# no doc
# rubocop:disable Metrics/ClassLength
class ListsController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render json: {
          accepted_lists: current_user.lists.accepted(current_user),
          not_accepted_lists: current_user.lists.not_accepted(current_user)
        }
      end
    end
  end

  def create
    @list = build_new_list
    if @list.save
      UsersList.create!(user: current_user, list: @list,
                        has_accepted: true, responded: true)
      render json: @list
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def show
    set_list
    set_ordered_items
    set_not_purchased_items
    set_purchased_items
    respond_to do |format|
      format.html { render :index }
      format.json do
        render json: { current_user_id: current_user.id, list: @list,
                       not_purchased_items: @not_purchased_items,
                       purchased_items: @purchased_items }
      end
    end
  end

  def edit
    list = List.find(params[:id])
    respond_to do |format|
      format.html { render :index }
      format.json { render json: list }
    end
  end

  def update
    @list = List.find(params[:id])
    if @list.update(list_params)
      render json: @list
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list = List.find(params[:id])
    @list.archive
    redirect_to lists_path, notice: "Your list was successfully deleted"
  end

  def refresh_list
    old_list = List.find(params[:id])
    old_list.update!(refreshed: true)
    new_list = create_new_list_from(old_list)
    UsersList.create!(user: current_user, list: new_list)
    accept_user_list(new_list)
    create_new_items(old_list, new_list)
    redirect_to lists_path, notice: "Your list was successfully refreshed"
  end

  private

  def list_params
    params.require(:list).permit(:user, :name, :completed, :refreshed, :type)
  end

  def accept_user_list(list)
    UsersList
      .find_by(list: list)
      .update!(has_accepted: true, responded: true)
  end

  def build_new_list
    case list_params[:type]
    when "ToDoList"
      ToDoList.new(list_params)
    when "BookList"
      BookList.new(list_params)
    when "MusicList"
      MusicList.new(list_params)
    else
      GroceryList.new(list_params)
    end
  end

  def create_new_list_from(old_list)
    case old_list.type
    when "ToDoList"
      ToDoList.create!(name: old_list[:name])
    when "BookList"
      BookList.create!(name: old_list[:name])
    when "MusicList"
      MusicList.create!(name: old_list[:name])
    else
      GroceryList.create!(name: old_list[:name])
    end
  end

  def create_new_items(old_list, new_list)
    case old_list.type
    when "ToDoList"
      create_to_do_list_items(old_list, new_list)
    when "BookList"
      create_book_list_items(old_list, new_list)
    when "MusicList"
      create_music_list_items(old_list, new_list)
    else
      create_grocery_list_items(old_list, new_list)
    end
  end

  def create_to_do_list_items(old_list, new_list)
    list_items(old_list).each do |item|
      ToDoListItem.create!(
        user: current_user,
        to_do_list: new_list,
        name: item[:name]
      )
    end
  end

  def create_book_list_items(old_list, new_list)
    list_items(old_list).each do |item|
      BookListItem.create!(
        user: current_user,
        book_list: new_list,
        title: item[:title]
      )
    end
  end

  def create_music_list_items(old_list, new_list)
    list_items(old_list).each do |item|
      MusicListItem.create!(
        user: current_user,
        music_list: new_list,
        title: item[:title],
        artist: item[:artist],
        album: item[:album]
      )
    end
  end

  def create_grocery_list_items(old_list, new_list)
    list_items(old_list).each do |item|
      GroceryListItem.create!(
        user: current_user,
        grocery_list: new_list,
        name: item[:name],
        quantity: item[:quantity],
        quantity_name: item[:quantity_name]
      )
    end
  end

  def list_items(list)
    case list.type
    when "ToDoList"
      ToDoListItem.where(to_do_list: list)
    when "BookList"
      BookListItem.where(book_list: list)
    when "MusicList"
      MusicListItem.where(music_list: list)
    else
      GroceryListItem.where(grocery_list: list)
    end
  end

  def set_list
    @list = List.find(params[:id])
  end

  def set_ordered_items
    @ordered_items = list_items(@list).not_archived.ordered
  end

  def set_not_purchased_items
    @not_purchased_items =
      if @list.type == "ToDoList"
        @ordered_items.not_completed
      else
        @ordered_items.not_purchased
      end
  end

  def set_purchased_items
    @purchased_items =
      if @list.type == "GroceryList"
        @ordered_items.purchased.not_refreshed
      elsif @list.type == "ToDoList"
        @ordered_items.completed.not_refreshed
      else
        @ordered_items.purchased
      end
  end
end
# rubocop:enable Metrics/ClassLength
