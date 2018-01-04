# frozen_string_literal: true

require "rails_helper"

RSpec.describe UsersListsController do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }
  let(:other_list) { create :list }
  let(:other_user) { create :user }

  before { sign_in user }

  describe "GET #index" do
    describe "format HTML" do
      it "renders 'lists/index'" do
        get :index, params: {
          list_id: list.id
        }

        expect(response).to render_template "lists/index"
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :index, params: {
          list_id: list.id
        }, format: :json

        expect(response).to be_success
        expect(JSON.parse(response.body)["users"].count)
          .to eq UsersList.where(list: list).accepted.count
      end
    end
  end

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
      before do
        new_user = User.create!(email: "new_user@example.com")
        new_list = GroceryList.create!(name: "foobar")
        UsersList.create!(
          user: user,
          list: new_list,
          has_accepted: true,
          responded: true
        )
        UsersList.create!(
          user: new_user,
          list: new_list,
          has_accepted: true,
          responded: true
        )
      end

      it "responds with success and correct payload" do
        get :new, params: {
          list_id: other_list.id
        }, format: :json

        expect(response).to be_success
        response_body = JSON.parse(response.body)
        expect(response_body["list"].to_h).to include(
          "id" => other_list[:id],
          "name" => other_list[:name],
          "archived_at" => other_list[:archived_at],
          "completed" => other_list[:completed],
          "refreshed" => other_list[:refreshed]
        )
        expect(response_body["users"].count).to eq 1
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
