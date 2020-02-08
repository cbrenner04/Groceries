# frozen_string_literal: true

# no doc
# TODO: This needs a service object
# rubocop:disable Metrics/ClassLength
class ListsController < ApplicationController
  before_action :require_list_access, only: %i[show]
  before_action :require_list_owner, only: %i[edit update destroy refresh_list]

  def index
    respond_to do |format|
      format.html
      format.json { render json: index_response }
    end
  end

  def create
    @list = build_new_list
    if @list.save
      users_list = create_users_list(current_user, @list)
      render json: list_response(@list, users_list)
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
      format.json do
        render json: {
          list: @list,
          current_user_id: current_user&.id
        }
      end
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
    if @list.archive
      render json: {}, status: :no_content
    else
      render json: @list.errors, status: :server_error
    end
  end

  # TODO: Should this be another controller?
  def refresh_list
    set_list
    @list.update!(refreshed: true)
    new_list = create_new_list_from(@list)
    users_list = create_users_list(current_user, new_list)
    accept_user_list(new_list)
    create_new_items(@list, new_list)
    render json: list_response(new_list, users_list)
  end

  private

  def list_params
    params.require(:list).permit(:user, :name, :completed, :refreshed, :type)
  end

  def require_list_access
    list = List.find(params[:id])
    users_list = UsersList.find_by(list: list, user: current_user)
    return if users_list&.has_accepted

    redirect_to lists_path
  end

  def require_list_owner
    list = List.find(params[:id])
    return if list.owner == current_user

    redirect_to lists_path
  end

  def accept_user_list(list)
    UsersList.find_by(list: list).update!(has_accepted: true)
  end

  def create_users_list(user, list)
    UsersList.create!(user: user, list: list, has_accepted: true)
  end

  # TODO: why split the lists? If we continue to split them,
  # why not split accepted into complete/incomplete as well?
  def index_response
    {
      accepted_lists: List.accepted(current_user),
      pending_lists: List.pending(current_user),
      is_user_signed_in: user_signed_in?,
      current_user_id: current_user&.id
    }
  end

  def show_response
    {
      current_user_id: current_user.id,
      list: @list,
      not_purchased_items: @not_purchased_items,
      purchased_items: @purchased_items,
      categories: @list.categories
    }
  end

  def list_response(list, users_list)
    # return object needs to be updated to include the users_list as this is
    # what the client expects, similar to the index_response > accepted_lists
    list.attributes.merge!(
      has_accepted: true,
      user_id: current_user.id,
      users_list_id: users_list.id
    ).to_json
  end

  # rubocop:disable Metrics/MethodLength
  def build_new_list
    new_list_params = list_params.merge!(owner: current_user)
    case new_list_params[:type]
    when "ToDoList"
      ToDoList.new(new_list_params)
    when "BookList"
      BookList.new(new_list_params)
    when "MusicList"
      MusicList.new(new_list_params)
    else
      GroceryList.new(new_list_params)
    end
  end
  # rubocop:enable Metrics/MethodLength

  def create_new_list_from(old_list)
    case old_list.type
    when "ToDoList"
      ToDoList.create!(name: old_list[:name], owner_id: old_list[:owner_id])
    when "BookList"
      BookList.create!(name: old_list[:name], owner_id: old_list[:owner_id])
    when "MusicList"
      MusicList.create!(name: old_list[:name], owner_id: old_list[:owner_id])
    else
      GroceryList.create!(name: old_list[:name], owner_id: old_list[:owner_id])
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

  # rubocop:disable Metrics/MethodLength
  def create_to_do_list_items(old_list, new_list)
    filtered_list = list_items(old_list).reject do |item|
      item.refreshed || item.archived_at.present?
    end
    filtered_list.each do |item|
      ToDoListItem.create!(
        user: current_user,
        to_do_list: new_list,
        task: item[:task],
        assignee_id: item[:assignee_id],
        due_by: item[:due_by],
        category: item[:category]
      )
    end
  end

  def create_book_list_items(old_list, new_list)
    filtered_list = list_items(old_list).reject do |item|
      item.archived_at.present?
    end
    filtered_list.each do |item|
      BookListItem.create!(
        user: current_user,
        book_list: new_list,
        author: item[:author],
        title: item[:title],
        category: item[:category]
      )
    end
  end

  def create_music_list_items(old_list, new_list)
    filtered_list = list_items(old_list).reject do |item|
      item.archived_at.present?
    end
    filtered_list.each do |item|
      MusicListItem.create!(
        user: current_user,
        music_list: new_list,
        title: item[:title],
        artist: item[:artist],
        album: item[:album],
        category: item[:category]
      )
    end
  end

  def create_grocery_list_items(old_list, new_list)
    filtered_list = list_items(old_list).reject do |item|
      item.refreshed || item.archived_at.present?
    end
    filtered_list.each do |item|
      GroceryListItem.create!(
        user: current_user,
        grocery_list: new_list,
        product: item[:product],
        quantity: item[:quantity],
        category: item[:category]
      )
    end
  end
  # rubocop:enable Metrics/MethodLength

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
