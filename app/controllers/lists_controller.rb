# frozen_string_literal: true
# no doc
class ListsController < ApplicationController
  before_action :set_list, only: [:show, :edit, :update, :destroy]

  def index
    @lists = List.all
  end

  def new
    @list = List.new
  end

  def create
    @list = current_user.lists.build(list_params)

    if @list.save
      redirect_to lists_path, notice: "Your list was successfully created"
    else
      render :new
    end
  end

  def show; end

  def edit; end

  def update
    if @list.update(list_params)
      redirect_to @list, notice: "Your list was successfully updated"
    else
      render :edit
    end
  end

  def destroy
    @list.destroy
    redirect_to lists_path, notice: "Your list was successfully deleted"
  end

  private

  def list_params
    params.require(:list).permit(:user, :name)
  end

  def set_list
    @list = List.find(params[:id])
  end
end
