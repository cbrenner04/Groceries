# frozen_string_literal: true

require "rails_helper"

describe "/lists/:list_id/book_list_items/:id", type: :request do
  let(:user) { create :user }
  let(:list) { create :book_list, owner: user }
  let(:users_list) { create :users_list, user: user, list: list }
  let(:item) { create :book_list_item, book_list: list }

  before { login user }

  describe "GET /edit" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "responds with forbidden" do
        get edit_list_book_list_item_path(item.id, list.id),
            headers: get_auth_params

        expect(response).to have_http_status :forbidden
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      it "responds with 200 and correct body" do
        get edit_list_book_list_item_path(item.id, list.id),
            headers: get_auth_params

        response_body = JSON.parse(response.body).to_h

        expect(response).to have_http_status :success
        expect(response_body["item"]).to include(
          "archived_at" => item[:archived_at],
          "id" => item[:id],
          "book_list_id" => item[:book_list_id],
          "author" => item[:author],
          "purchased" => item[:purchased],
          "title" => item[:title],
          "read" => item[:read],
          "user_id" => item[:user_id],
          "number_in_series" => item[:number_in_series],
          "category" => item[:category]
        )
        expect(response_body["list"]).to include(
          "id" => list[:id],
          "name" => list[:name],
          "archived_at" => list[:archived_at],
          "completed" => list[:completed],
          "refreshed" => list[:refreshed],
          "type" => list[:type]
        )
        # TODO: check categories
      end
    end
  end

  describe "POST #create" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        post :create, params: {
          book_list_item: {
            book_list_id: list.id,
            user_id: user.id,
            author: "foo",
            number_in_series: 1,
            category: "foo"
          },
          list_id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      describe "with valid params" do
        it "creates a new item" do
          expect do
            post :create, params: {
              book_list_item: {
                book_list_id: list.id,
                user_id: user.id,
                author: "foo",
                number_in_series: 1,
                category: "foo"
              },
              list_id: list.id
            }
          end.to change(BookListItem, :count).by 1
        end
      end

      describe "with invalid params" do
        it "returns 422 and error message" do
          post :create, params: {
            book_list_item: {
              book_list_id: list.id,
              author: nil
            },
            list_id: list.id
          }

          expect(response.status).to eq 422
          expect(response.body).not_to be_blank
        end
      end
    end
  end

  describe "PUT #update" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        update_item = create :book_list_item, author: "foo"
        put :update, params: {
          id: update_item.id,
          book_list_item: {
            author: "bar"
          },
          list_id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      describe "with valid data" do
        it "updates a item" do
          update_item = create :book_list_item, author: "foo"
          put :update, params: {
            id: update_item.id,
            book_list_item: {
              author: "bar"
            },
            list_id: list.id
          }
          update_item.reload

          expect(update_item.author).to eq "bar"
        end
      end

      describe "with invalid data" do
        it "return 422 and error message" do
          update_item = create :book_list_item, author: "foo"
          put :update, params: {
            id: update_item.id,
            book_list_item: {
              author: "",
              title: ""
            },
            list_id: list.id
          }

          expect(response.status).to eq 422
          expect(response.body).not_to be_blank
        end
      end
    end
  end

  describe "DELETE #destroy" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        delete_item = create :book_list_item, author: "foo"
        delete :destroy, params: {
          id: delete_item.id,
          list_id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      it "destroys a item" do
        delete_item = create :book_list_item, author: "foo"
        delete :destroy, params: {
          id: delete_item.id,
          list_id: list.id
        }

        expect(BookListItem.not_archived).not_to include delete_item
      end
    end
  end
end
