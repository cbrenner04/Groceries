# frozen_string_literal: true

require "rails_helper"

module Users
  RSpec.describe PasswordsController do
    let(:user) { create :user_with_lists }

    before { @request.env["devise.mapping"] = Devise.mappings[:user] }

    describe "GET #new" do
      it "successful" do
        get :new

        expect(response.status).to eq 200
      end
    end

    describe "POST #create" do
      context "with valid params" do
        it "successful"
      end

      context "with invalid params" do
        it "returns 422"
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
