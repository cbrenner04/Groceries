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
      UsersList
        .find_by(list: @list)
        .update!(has_accepted: true, responded: true)
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

  private

  def list_params
    params.require(:list).permit(:user, :name, :completed)
  end
end
