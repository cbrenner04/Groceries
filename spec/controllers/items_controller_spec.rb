# frozen_string_literal: true
require "rails_helper"

RSpec.describe ItemsController, type: :controller do
  let(:user) { create :user }
  let(:list) { create :list, user: user }
  let(:item) { create :item, list: list }

  before { sign_in user }

  describe "GET #new" do
    it "assigns a new item as @item" do
      get :new, params: {
        list_id: list.id
      }

      expect(assigns(:item)).to be_a Item
    end
  end

  describe "GET #edit" do
    it "assigns the requested item as @item" do
      get :edit, params: {
        id: item.id,
        list_id: list.id
      }

      expect(assigns(:item)).to eq item
    end
  end

  describe "POST #create" do
    describe "with valid params" do
      it "creates a new item" do
        expect do
          post :create, params: {
            item: {
              user_id: user.id,
              name: "foo"
            },
            list_id: list.id
          }
        end.to change(Item, :count).by 1
      end
    end

    describe "with invalid params" do
      it "re-renders the 'new' template" do
        post :create, params: {
          item: {
            name: nil
          },
          list_id: list.id
        }

        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    describe "with valid params" do
      it "updates a item" do
        update_item = create :item, name: "foo"
        put :update, params: {
          id: update_item.id,
          item: {
            name: "bar"
          },
          list_id: list.id
        }
        update_item.reload

        expect(update_item.name).to eq "bar"
      end
    end

    describe "with invalid params" do
      it "re-renders the 'edit' template" do
        item = create :item
        put :update, params: {
          id: item.id, item: {
            name: nil
          },
          list_id: list.id
        }

        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys a item" do
      delete_item = create :item, name: "foo"
      delete :destroy, params: {
        id: delete_item.id,
        list_id: list.id
      }

      expect(Item.all).to_not include delete_item
    end
  end
end