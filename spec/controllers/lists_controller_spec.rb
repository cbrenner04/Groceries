# frozen_string_literal: true
require "rails_helper"

RSpec.describe ListsController do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }

  before { sign_in user }

  describe "GET #index" do
    it "assigns lists as @lists" do
      get :index

      expect(assigns(:lists)).to include list
    end
  end

  describe "GET #new" do
    it "assigns a new list as @list" do
      get :new

      expect(assigns(:list)).to be_a List
    end
  end

  describe "GET #show" do
    it "assigns the requested list as @list" do
      get :show, params: {
        id: list.id
      }

      expect(assigns(:list)).to eq list
    end
  end

  describe "GET #edit" do
    it "assigns the requested list as @list" do
      get :edit, params: {
        id: list.id
      }

      expect(assigns(:list)).to eq list
    end
  end

  describe "POST #create" do
    describe "with valid params" do
      it "creates a new list" do
        expect do
          post :create, params: {
            list: {
              user_id: user.id,
              name: "foo"
            }
          }
        end.to change(List, :count).by 1
      end
    end

    describe "with invalid params" do
      it "re-renders the 'new' template" do
        post :create, params: {
          list: {
            name: nil
          }
        }

        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    describe "with valid params" do
      it "updates a list" do
        update_list = create :list, name: "foo"
        put :update, params: {
          id: update_list.id,
          list: {
            name: "bar"
          }
        }
        update_list.reload

        expect(update_list.name).to eq "bar"
      end
    end

    describe "with invalid params" do
      it "re-renders the 'edit' template" do
        list = create :list
        put :update, params: {
          id: list.id,
          list: {
            name: nil
          }
        }

        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys a list" do
      delete_list = create :list, name: "foo"
      delete :destroy, params: {
        id: delete_list.id
      }

      expect(List.all).to_not include delete_list
    end
  end
end
