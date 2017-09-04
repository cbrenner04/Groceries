# frozen_string_literal: true

require "rails_helper"

module Users
  RSpec.describe SessionsController, type: :controller do
    before { request.env["devise.mapping"] = Devise.mappings[:user] }

    describe "GET new" do
      it "renders 'lists/index" do
        get :new

        expect(response).to render_template "lists/index"
      end
    end
  end
end
