# frozen_string_literal: true

require "rails_helper"

RSpec.describe UsersListsController do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }
  let(:users_list) { list.users_lists.find_by(user: user) }
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

        expect(response).to be_successful
        response_body = JSON.parse(response.body)
        expect(response_body["list"].to_h).to include(
          "id" => list[:id],
          "name" => list[:name],
          "archived_at" => list[:archived_at],
          "completed" => list[:completed],
          "refreshed" => list[:refreshed]
        )
        expect(response_body["accepted"].count).to eq 1
      end
    end
  end

  describe "PATCH #update" do
    context "users_list exists" do
      it "accepts list" do
        patch :update, params: {
          list_id: list.id,
          id: users_list.id,
          users_list: {
            has_accepted: true
          }
        }
        users_list = JSON.parse(response.body)
        expect(users_list["has_accepted"]).to eq true
      end

      it "rejects list" do
        patch :update, params: {
          list_id: list.id,
          id: users_list.id,
          users_list: {
            has_accepted: false
          }
        }
        users_list = JSON.parse(response.body)
        expect(users_list["has_accepted"]).to eq false
      end

      describe "permissions" do
        context "with good data" do
          it "updates permissions" do
            patch :update, params: {
              list_id: list.id,
              id: users_list.id,
              users_list: {
                permissions: "read"
              }
            }
            users_list = JSON.parse(response.body)
            expect(users_list["permissions"]).to eq "read"
          end
        end

        context "with bad data" do
          it "returns 422" do
            patch :update, params: {
              list_id: list.id,
              id: users_list.id,
              users_list: {
                permissions: "foo"
              }
            }
            expect(response.status).to eq 422
          end
        end
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
