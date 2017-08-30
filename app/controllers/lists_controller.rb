# frozen_string_literal: true

# no doc
class ListsController < ApplicationController
  def index
    @accepted_lists = current_user.lists.accepted(current_user)
    @not_accepted_lists = current_user.lists.not_accepted(current_user)
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
    @list = List.find(params[:id])
  end

  def edit
    @list = List.find(params[:id])
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
end
