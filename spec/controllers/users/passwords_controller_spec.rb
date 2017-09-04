# frozen_string_literal: true

require "rails_helper"

module Users
  RSpec.describe PasswordsController, type: :controller do
    before { request.env["devise.mapping"] = Devise.mappings[:user] }

    describe "GET new" do
      it "renders 'lists/index" do
        get :new

        expect(response).to render_template "lists/index"
      end
    end

    describe "GET edit" do
      it "renders 'lists/index" do
        get :edit, params: {
          reset_password_token: "foo"
        }

        expect(response).to render_template "lists/index"
      end
    end
  end
end
