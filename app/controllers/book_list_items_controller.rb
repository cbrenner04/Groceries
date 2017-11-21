# frozen_string_literal: true

# no doc
class BookListItemsController < ApplicationController
  def create
    @item = BookListItem
            .create(item_params.merge!(book_list_id: params[:list_id]))

    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def edit
    item = BookListItem.find(params[:id])
    list = BookList.find(item.book_list_id)
    respond_to do |format|
      format.html { render template: "lists/index" }
      format.json { render json: { item: item, list: list } }
    end
  end

  def update
    @item = BookListItem.find(params[:id])
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list = List.find(params[:list_id])
    @item = BookListItem.find(params[:id])
    @item.archive
    redirect_to list_url(@list.id), notice: "Your item was successfully deleted"
  end

  private

  def item_params
    params
      .require(:book_list_item)
      .permit(:user_id, :list_id, :author, :title, :purchased, :read)
  end
end
