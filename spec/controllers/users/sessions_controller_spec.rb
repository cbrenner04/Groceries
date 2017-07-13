# frozen_string_literal: true

require "rails_helper"

module Users
  RSpec.describe SessionsController do
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
  end
end
