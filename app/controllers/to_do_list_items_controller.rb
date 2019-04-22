# frozen_string_literal: true

# no doc
class ToDoListItemsController < ListItemsController
  def create
    @item = ToDoListItem
            .create(item_params.merge!(to_do_list_id: params[:list_id]))

    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def edit
    item = ToDoListItem.find(params[:id])
    list = ToDoList.find(item.to_do_list_id)
    respond_to do |format|
      format.html { render template: "lists/index" }
      format.json { render json: { item: item, list: list } }
    end
  end

  def update
    @item = ToDoListItem.find(params[:id])
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @list = List.find(params[:list_id])
    @item = ToDoListItem.find(params[:id])
    @item.archive
    redirect_to list_url(@list.id), notice: "Your item was successfully deleted"
  end

  private

  def item_params
    params.require(:to_do_list_item).permit(
      :user_id, :list_id, :task, :assignee_id, :due_by, :completed, :refreshed
    )
  end
end
