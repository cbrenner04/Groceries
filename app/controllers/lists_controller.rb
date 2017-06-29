# frozen_string_literal: true

# no doc
class ListsController < ApplicationController
  def index
    @lists = current_user.lists.not_archived.descending
  end

  def create
    @list = current_user.lists.create(list_params)
    if @list.save
      render json: @list
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def show
    @list = ListPresenter.new(List.find(params[:id]))
  end

  def edit
    @list = ListPresenter.new(List.find(params[:id]))
  end

  def update
    @list = ListPresenter.new(List.find(params[:id]))
    if @list.update(list_params)
      render json: @list
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list = ListPresenter.new(List.find(params[:id]))
    @list.archive
    redirect_to lists_path, notice: "Your list was successfully deleted"
  end

  private

  def list_params
    params.require(:list).permit(:user, :name)
  end
end
