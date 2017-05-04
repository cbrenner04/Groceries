# frozen_string_literal: true

# no doc
class ItemsController < ApplicationController
  before_action :set_list, except: %i[autocomplete]
  before_action :set_item, only: %i[edit update destroy]

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
