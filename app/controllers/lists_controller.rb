# frozen_string_literal: true

# no doc
# rubocop:disable Metrics/ClassLength
class ListsController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json { render json: index_response }
    end
  end

  def create
    @list = build_new_list
    if @list.save
      create_users_list(current_user, @list)
      render json: @list
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def show
    set_up_list
    respond_to do |format|
      format.html { render :index }
      format.json { render json: show_response }
    end
  end

  def edit
    set_list
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @list }
    end
  end

  def update
    set_list
    if @list.update(list_params)
      render json: @list
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def destroy
    set_list
    @list.archive
    redirect_to lists_path, notice: "Your list was successfully deleted"
  end

  def refresh_list
    set_list
    @list.update!(refreshed: true)
    new_list = create_new_list_from(@list)
    create_users_list(current_user, new_list)
    accept_user_list(new_list)
    create_new_items(@list, new_list)
    redirect_to lists_path, notice: "Your list was successfully refreshed"
  end

  private

  def list_params
    params.require(:list).permit(:user, :name, :completed, :refreshed, :type)
  end

  def accept_user_list(list)
    UsersList.find_by(list: list).update!(has_accepted: true)
  end

  def create_users_list(user, list)
    UsersList.create!(user: user, list: list, has_accepted: true)
  end

  def index_response
    {
      accepted_lists: List.accepted(current_user),
      not_accepted_lists: List.not_accepted(current_user),
      is_user_signed_in: user_signed_in?
    }
  end

  def show_response
    {
      current_user_id: current_user.id,
      list: @list,
      not_purchased_items: @not_purchased_items,
      purchased_items: @purchased_items
    }
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
        task: item[:task],
        assignee_id: item[:assignee_id],
        due_by: item[:due_by]
      )
    end
  end

  def create_book_list_items(old_list, new_list)
    list_items(old_list).each do |item|
      BookListItem.create!(
        user: current_user,
        book_list: new_list,
        author: item[:author],
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
        product: item[:product],
        quantity: item[:quantity]
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

  def set_up_list
    set_list
    set_ordered_items
    set_not_purchased_items
    set_purchased_items
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
