# frozen_string_literal: true
# no doc
class ItemsController < ApplicationController
  before_action :set_list
  before_action :set_item, only: [:edit, :update, :destroy]

  def new
    @item = Item.new
  end

  def create
    @item = @list.items.build(item_params)

    if @item.save
      redirect_to new_item_path(list_id: params[:list_id]),
                  notice: "Your item was successfully created"
    else
      render :new
    end
  end

  def edit; end

  def update
    if @item.update(item_params)
      redirect_to @list, notice: "Your item was successfully updated"
    else
      render :edit
    end
  end

  def destroy
    @item.destroy
    redirect_to @list, notice: "Your item was successfully deleted"
  end

  private

  def item_params
    params.require(:item).permit(
      :user_id, :name, :list_id, :quantity, :purchased, :quantity_name
    )
  end

  def set_item
    @item = Item.find(params[:id])
  end

  def set_list
    @list = List.find(params[:list_id])
  end
end
