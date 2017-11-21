# frozen_string_literal: true

require "rails_helper"

RSpec.describe BookListItemsController do
  let(:user) { create :user }
  let(:list) { create :book_list }
  let(:users_list) { create :users_list, user: user, list: list }
  let(:item) { create :book_list_item, book_list: list }

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
        expect(JSON.parse(response.body)["item"].to_h).to include(
          "archived_at" => item[:archived_at],
          "id" => item[:id],
          "book_list_id" => item[:book_list_id],
          "author" => item[:author],
          "purchased" => item[:purchased],
          "title" => item[:title],
          "read" => item[:read],
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
            book_list_item: {
              book_list_id: list.id,
              user_id: user.id,
              author: "foo"
            },
            list_id: list.id
          }
        end.to change(BookListItem, :count).by 1
      end
    end

    describe "with invalid params" do
      it "returns 422" do
        post :create, params: {
          book_list_item: {
            book_list_id: list.id,
            author: nil
          },
          list_id: list.id
        }

        expect(response.status).to eq 422
      end
    end
  end

  describe "PUT #update" do
    it "updates a item" do
      update_item = create :book_list_item, author: "foo"
      put :update, params: {
        id: update_item.id,
        book_list_item: { author: "bar" },
        list_id: list.id
      }
      update_item.reload

      expect(update_item.author).to eq "bar"
    end
  end

  describe "DELETE #destroy" do
    it "destroys a item" do
      delete_item = create :book_list_item, author: "foo"
      delete :destroy, params: {
        id: delete_item.id,
        list_id: list.id
      }

      expect(BookListItem.not_archived).to_not include delete_item
    end
  end
end
