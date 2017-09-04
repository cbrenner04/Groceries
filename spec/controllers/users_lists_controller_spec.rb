# frozen_string_literal: true

require "rails_helper"

RSpec.describe UsersListsController do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }
  let(:other_list) { create :list }
  let(:other_user) { create :user }

  before { sign_in user }

  describe "GET #new" do
    describe "format HTML" do
      it "renders 'lists/index'" do
        get :new, params: {
          list_id: list.id
        }

        expect(response).to render_template "lists/index"
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :new, params: {
          list_id: list.id
        }, format: :json

        expect(response).to be_success
        expect(JSON.parse(response.body)["list"].to_h).to include(
          "id" => list[:id],
          "name" => list[:name],
          "archived_at" => list[:archived_at],
          "completed" => list[:completed],
          "refreshed" => list[:refreshed]
        )
      end
    end
  end

  describe "GET #accept_list" do
    context "users_list exists" do
      it "returns a 200" do
        get :accept_list, params: {
          list_id: list.id
        }
        users_list = JSON.parse(response.body)
        expect(users_list["has_accepted"]).to eq true
      end
    end

    context "users_list does not exist" do
      it "returns a 422" do
        get :accept_list, params: {
          list_id: other_list.id
        }
        expect(response.status).to eq 422
      end
    end
  end

  describe "GET #reject_list" do
    context "users_list exists" do
      it "returns updated users list" do
        get :reject_list, params: {
          list_id: list.id
        }
        users_list = JSON.parse(response.body)
        expect(users_list["responded"]).to eq true
      end
    end

    context "users_list does not exist" do
      it "returns a 422" do
        get :reject_list, params: {
          list_id: other_list.id
        }
        expect(response.status).to eq 422
      end
    end
  end

  describe "POST #create" do
    describe "with valid params" do
      it "creates a new users list" do
        expect do
          post :create, params: {
            users_list: {
              user_id: other_user.id,
              list_id: list.id
            },
            list_id: list.id
          }
        end.to change(UsersList, :count).by 1
      end
    end

    describe "with invalid params" do
      it "re-renders the 'new' template" do
        post :create, params: {
          users_list: {
            user_id: nil
          },
          list_id: list.id
        }

        expect(response.status).to eq 422
      end
    end
  end
end
