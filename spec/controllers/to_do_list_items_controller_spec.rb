# frozen_string_literal: true

require "rails_helper"

RSpec.describe ToDoListItemsController do
  let(:user) { create :user }
  let(:list) { create :to_do_list, owner: user }
  let(:users_list) { create :users_list, user: user, list: list }
  let(:item) { create :to_do_list_item, to_do_list: list, assignee_id: user.id }

  before { sign_in user }

  describe "GET #edit" do
    describe "format HTML" do
      it "renders 'lists/index'" do
        get :edit, params: {
          id: item.id,
          list_id: list.id
        }

        expect(response).to render_template "lists/index"
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :edit, params: {
          id: item.id,
          list_id: list.id
        }, format: :json

        expect(response).to be_successful
        response_body = JSON.parse(response.body).to_h
        expect(response_body["item"]).to include(
          "archived_at" => item[:archived_at],
          "id" => item[:id],
          "to_do_list_id" => item[:to_do_list_id],
          "task" => item[:task],
          "completed" => item[:completed],
          "assignee_id" => item[:assignee_id],
          "due_by" => item[:due_by],
          "refreshed" => item[:refreshed],
          "user_id" => item[:user_id]
        )
        expect(response_body["list"]).to include(
          "id" => list[:id],
          "name" => list[:name],
          "archived_at" => list[:archived_at],
          "completed" => list[:completed],
          "refreshed" => list[:refreshed],
          "type" => list[:type]
        )
      end
    end
  end

  describe "POST #create" do
    describe "with valid params" do
      it "creates a new item" do
        expect do
          post :create, params: {
            to_do_list_item: {
              to_do_list_id: list.id,
              user_id: user.id,
              task: "foo"
            },
            list_id: list.id
          }
        end.to change(ToDoListItem, :count).by 1
      end
    end

    describe "with invalid params" do
      it "returns 422 and error message" do
        post :create, params: {
          to_do_list_item: {
            to_do_list_id: list.id,
            task: nil
          },
          list_id: list.id
        }

        expect(response.status).to eq 422
        expect(response.body).to_not be_blank
      end
    end
  end

  describe "PUT #update" do
    describe "with valid data" do
      it "updates a item" do
        update_item = create :to_do_list_item, task: "foo", assignee_id: user.id
        put :update, params: {
          id: update_item.id,
          to_do_list_item: { task: "bar" },
          list_id: list.id
        }
        update_item.reload

        expect(update_item.task).to eq "bar"
      end
    end

    describe "with invalid data" do
      it "returns 422 and error message" do
        update_item = create :to_do_list_item, task: "foo", assignee_id: user.id
        put :update, params: {
          id: update_item.id,
          to_do_list_item: { task: "" },
          list_id: list.id
        }

        expect(response.status).to eq 422
        expect(response.body).to_not be_blank
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys a item" do
      delete_item = create :to_do_list_item, task: "foo", assignee_id: user.id
      delete :destroy, params: {
        id: delete_item.id,
        list_id: list.id
      }

      expect(ToDoListItem.not_archived).to_not include delete_item
    end
  end
end
