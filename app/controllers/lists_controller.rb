# frozen_string_literal: true
# no doc
class ListsController < ApplicationController
  before_action :set_list, only: [:show, :edit, :update, :destroy]

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

  def show; end

  def edit; end

  def update
    if @list.update(list_params)
      redirect_to lists_path, notice: "Your list was successfully updated"
    else
      render :edit
    end
  end

  def destroy
    @list.archive
    redirect_to lists_path, notice: "Your list was successfully deleted"
  end

  private

  def list_params
    params.require(:list).permit(:user, :name)
  end

  def set_list
    @list = ListPresenter.new(List.find(params[:id]))
  end
end
