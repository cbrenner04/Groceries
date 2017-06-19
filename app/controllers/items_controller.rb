# frozen_string_literal: true

# no doc
class ItemsController < ApplicationController
  before_action :set_list, except: %i[create autocomplete]
  before_action :set_item, only: %i[edit update destroy]

  def create
    list = List.find(item_params[:list_id])
    @item = list.items.build(item_params)

    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
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
    @item.archive
    redirect_to @list, notice: "Your item was successfully deleted"
  end

  def autocomplete
    render json: Item.search(
      params[:name],
      fields: %w[name],
      match: :word_start,
      limit: 10,
      load: false,
      misspellings: { below: 5 }
    ).map(&:name)
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
