# frozen_string_literal: true

# no doc
class GroceryListItemsController < ListItemsController
  def create
    @item = GroceryListItem
            .create(item_params.merge!(grocery_list_id: params[:list_id]))

    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def edit
    item = GroceryListItem.find(params[:id])
    list = GroceryList.find(item.grocery_list_id)
    respond_to do |format|
      format.html { render template: "lists/index" }
      format.json { render json: { item: item, list: list } }
    end
  end

  def update
    @item = GroceryListItem.find(params[:id])
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list = List.find(params[:list_id])
    @item = GroceryListItem.find(params[:id])
    @item.archive
    head :no_content
  end

  private

  def item_params
    params
      .require(:grocery_list_item)
      .permit(:user_id,
              :product,
              :list_id,
              :quantity,
              :purchased,
              :refreshed,
              :category)
  end
end
