# frozen_string_literal: true

require "rails_helper"

RSpec.describe ToDoListItemsController do
  let(:user) { create :user }
  let(:list) { create :to_do_list }
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

        expect(response).to be_success
        expect(JSON.parse(response.body).to_h).to include(
          "archived_at" => item[:archived_at],
          "id" => item[:id],
          "to_do_list_id" => item[:to_do_list_id],
          "name" => item[:name],
          "completed" => item[:completed],
          "assignee_id" => item[:assignee_id],
          "due_by" => item[:due_by],
          "refreshed" => item[:refreshed],
          "user_id" => item[:user_id]
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
              name: "foo"
            },
            list_id: list.id
          }
        end.to change(ToDoListItem, :count).by 1
      end
    end

    describe "with invalid params" do
      it "returns 422" do
        post :create, params: {
          to_do_list_item: {
            to_do_list_id: list.id,
            name: nil
          },
          list_id: list.id
        }

        expect(response.status).to eq 422
      end
    end
  end

  describe "PUT #update" do
    it "updates a item" do
      update_item = create :to_do_list_item, name: "foo", assignee_id: user.id
      put :update, params: {
        id: update_item.id,
        to_do_list_item: { name: "bar" },
        list_id: list.id
      }
      update_item.reload

      expect(update_item.name).to eq "bar"
    end
  end

  describe "DELETE #destroy" do
    it "destroys a item" do
      delete_item = create :to_do_list_item, name: "foo", assignee_id: user.id
      delete :destroy, params: {
        id: delete_item.id,
        list_id: list.id
      }

      expect(ToDoListItem.not_archived).to_not include delete_item
    end
  end
end
