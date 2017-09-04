# frozen_string_literal: true

# no doc
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
    @list = current_user.lists.create(list_params)
    if @list.save
      accept_user_list(@list)
      render json: @list
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def show
    set_list
    set_ordered_items
    respond_to do |format|
      format.html { render :index }
      format.json do
        render json: { current_user_id: current_user.id, list: @list,
                       not_purchased_items: @ordered_items.not_purchased,
                       purchased_items: @ordered_items.purchased.not_refreshed }
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
    list = List.find(params[:id])
    list.update!(refreshed: true)
    new_list = current_user.lists.create!(name: list[:name])
    accept_user_list(new_list)
    create_new_items(list.items, new_list)
    redirect_to lists_path, notice: "Your list was successfully refreshed"
  end

  private

  def list_params
    params.require(:list).permit(:user, :name, :completed, :refreshed)
  end

  def accept_user_list(list)
    UsersList
      .find_by(list: list)
      .update!(has_accepted: true, responded: true)
  end

  def create_new_items(items, list)
    items.each do |item|
      Item.create!(
        user: current_user,
        list: list,
        name: item[:name],
        quantity: item[:quantity],
        quantity_name: item[:quantity_name]
      )
    end
  end

  def set_list
    @list = List.find(params[:id])
  end

  def set_ordered_items
    @ordered_items = @list.items.not_archived.ordered
  end
end
