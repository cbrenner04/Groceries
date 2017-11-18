# frozen_string_literal: true

# no doc
class MusicListItemsController < ApplicationController
  def create
    @item = MusicListItem
            .create(item_params.merge!(music_list_id: params[:list_id]))

    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def edit
    item = MusicListItem.find(params[:id])
    respond_to do |format|
      format.html { render template: "lists/index" }
      format.json { render json: item }
    end
  end

  def update
    @item = MusicListItem.find(params[:id])
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list = List.find(params[:list_id])
    @item = MusicListItem.find(params[:id])
    @item.archive
    redirect_to list_url(@list.id), notice: "Your item was successfully deleted"
  end

  private

  def item_params
    params
      .require(:music_list_item)
      .permit(:user_id, :list_id, :title, :artist, :album, :purchased)
  end
end
