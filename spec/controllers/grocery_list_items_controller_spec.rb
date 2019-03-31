# frozen_string_literal: true

require "rails_helper"

RSpec.describe GroceryListItemsController do
  let(:user) { create :user }
  let(:list) { create :grocery_list, owner: user }
  let!(:users_list) { create :users_list, user: user, list: list }
  let(:item) { create :grocery_list_item, grocery_list: list }

  before { sign_in user }

  describe "GET #edit" do
    describe "format HTML" do
      describe "with read access" do
        before { users_list.update!(permissions: "read") }

        it "redirects to lists_path" do
          get :edit, params: {
            id: item.id,
            list_id: list.id
          }

          expect(response).to redirect_to lists_path
        end
      end

      describe "with write access" do
        before { users_list.update!(permissions: "write") }

        it "renders 'lists/index'" do
          get :edit, params: {
            id: item.id,
            list_id: list.id
          }

          expect(response).to render_template "lists/index"
        end
      end
    end

    describe "format JSON" do
      describe "with read access" do
        before { users_list.update!(permissions: "read") }

        it "redirects to lists_path" do
          get :edit, params: {
            id: item.id,
            list_id: list.id
          }, format: :json

          expect(response).to redirect_to lists_path
        end
      end

      describe "with write access" do
        before { users_list.update!(permissions: "write") }

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
            "grocery_list_id" => item[:grocery_list_id],
            "product" => item[:product],
            "purchased" => item[:purchased],
            "quantity" => item[:quantity],
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
  end

  describe "POST #create" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        post :create, params: {
          grocery_list_item: {
            grocery_list_id: list.id,
            user_id: user.id,
            product: "foo"
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
              grocery_list_item: {
                grocery_list_id: list.id,
                user_id: user.id,
                product: "foo"
              },
              list_id: list.id
            }
          end.to change(GroceryListItem, :count).by 1
        end
      end

      describe "with invalid params" do
        it "returns 422 and error message" do
          post :create, params: {
            grocery_list_item: {
              grocery_list_id: list.id,
              product: nil
            },
            list_id: list.id
          }

          expect(response.status).to eq 422
          expect(response.body).to_not be_blank
        end
      end
    end
  end

  describe "PUT #update" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        update_item = create :grocery_list_item, product: "foo"
        put :update, params: {
          id: update_item.id,
          grocery_list_item: { product: "bar" },
          list_id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      describe "with valid params" do
        it "updates a item" do
          update_item = create :grocery_list_item, product: "foo"
          put :update, params: {
            id: update_item.id,
            grocery_list_item: { product: "bar" },
            list_id: list.id
          }
          update_item.reload

          expect(update_item.product).to eq "bar"
        end
      end

      describe "with invalid params" do
        it "returns 422 and error message" do
          item = create :grocery_list_item
          put :update, params: {
            id: item.id,
            grocery_list_item: { product: nil },
            list_id: list.id
          }

          expect(response.status).to eq 422
          expect(response.body).to_not be_blank
        end
      end
    end
  end

  describe "DELETE #destroy" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        delete_item = create :grocery_list_item, product: "foo"
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
        delete_item = create :grocery_list_item, product: "foo"
        delete :destroy, params: {
          id: delete_item.id,
          list_id: list.id
        }

        expect(GroceryListItem.not_archived).to_not include delete_item
      end
    end
  end
end
