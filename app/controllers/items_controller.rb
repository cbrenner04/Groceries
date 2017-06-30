# frozen_string_literal: true

# no doc
class ItemsController < ApplicationController
  def create
    list = List.find(item_params[:list_id])
    @item = list.items.build(item_params)

    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def edit
    @list = List.find(params[:list_id])
    @item = Item.find(params[:id])
  end

  def update
    @item = Item.find(params[:id])
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list = List.find(params[:list_id])
    @item = Item.find(params[:id])
    @item.archive
    redirect_to @list, notice: "Your item was successfully deleted"
  end

  private

  def item_params
    params.require(:item).permit(
      :user_id, :name, :list_id, :quantity, :purchased, :quantity_name
    )
  end
end
