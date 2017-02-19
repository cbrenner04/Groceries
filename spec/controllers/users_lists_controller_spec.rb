# frozen_string_literal: true
require "rails_helper"

RSpec.describe UsersListsController do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }
  let(:other_user) { create :user }

  before { sign_in user }

  describe "GET #new" do
    it "assigns a new users list as @users_list" do
      get :new, params: {
        list_id: list.id
      }

      expect(assigns(:users_list)).to be_a UsersList
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

        expect(response).to render_template("new")
      end
    end
  end
end
