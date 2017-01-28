# frozen_string_literal: true
require "rails_helper"

RSpec.describe ListsController, type: :controller do
  let(:user) { create :user }
  let(:list) { create :list }

  before { sign_in user }

  describe "GET #index" do
    it "assigns lists as @lists" do
      get :index

      expect(assigns(:lists)).to include list
    end
  end

  describe "POST #create" do
    it "creates a new list" do
      expect do
        post :create,
             params: {
               list: {
                 user_id: user.id,
                 name: "foo"
               }
             }
      end.to change(List, :count).by 1
    end
  end
end
