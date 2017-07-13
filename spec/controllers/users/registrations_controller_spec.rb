# frozen_string_literal: true

require "rails_helper"

module Users
  RSpec.describe RegistrationsController do
    before { @request.env["devise.mapping"] = Devise.mappings[:user] }

    describe "GET #new" do
      it "successful" do
        get :new

        expect(response.status).to eq 200
      end
    end

    describe "POST #create" do
      describe "with valid params" do
        it "creates a new user" do
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

    describe "GET #edit" do
      it "successful" do
        get :edit

        expect(response.status).to eq 302
      end
    end

    describe "POST #update" do
      context "with valid params" do
        it "successful"
      end

      context "with invalid params" do
        it "returns 422"
      end
    end
  end
end
