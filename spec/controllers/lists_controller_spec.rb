# frozen_string_literal: true

require "rails_helper"

RSpec.describe ListsController do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }

  before { sign_in user }

  describe "GET #index" do
    describe "format HTML" do
      it "assigns renders index" do
        get :index

        expect(response).to render_template :index
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :index, format: :json

        expect(response).to be_success
        expect(JSON.parse(response.body)["accepted_lists"].count)
          .to eq user.lists.accepted(user).count
        expect(JSON.parse(response.body)["not_accepted_lists"].count)
          .to eq user.lists.not_accepted(user).count
      end
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
    describe "format HTML" do
      it "renders index" do
        get :edit, params: {
          id: list.id
        }

        expect(response).to render_template :index
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :edit, params: {
          id: list.id
        }, format: :json

        expect(JSON.parse(response.body).to_h).to include(
          "archived_at" => list[:archived_at],
          "completed" => list[:completed],
          "id" => list[:id],
          "name" => list[:name],
          "refreshed" => list[:refreshed]
        )
      end
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
        }, format: "json"

        expect(JSON.parse(response.body))
          .to eq("name" => ["can't be blank"])
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
        }, format: "json"

        expect(JSON.parse(response.body))
          .to eq("name" => ["can't be blank"])
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys a list" do
      delete_list = create :list, name: "foo"
      delete :destroy, params: {
        id: delete_list.id
      }

      expect(List.not_archived).to_not include delete_list
    end
  end

  describe "POST #refresh_list" do
    it "creates new list" do
      expect do
        post :refresh_list, params: {
          id: list.id
        }
      end.to change(List, :count).by 1
    end

    it "creates new items" do
      Item.create!(
        user: user,
        list: list,
        name: "foo",
        quantity: 1,
        quantity_name: "bar"
      )
      expect do
        post :refresh_list, params: {
          id: list.id
        }
      end.to change(Item, :count).by 1
    end
  end
end
