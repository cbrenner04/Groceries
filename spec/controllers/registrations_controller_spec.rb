# frozen_string_literal: true

require "rails_helper"

RSpec.describe RegistrationsController do
  before { @request.env["devise.mapping"] = Devise.mappings[:user] }

  describe "POST #create" do
    describe "with valid params" do
      it "creates a new list" do
        expect do
          post :create, params: {
            user: {
              first_name: "foo",
              email: "foo@bar.com",
              password: "supersecret",
              password_confirmation: "supersecret"
            }
          }
        end.to change(User, :count).by 1
      end
    end
  end
end
