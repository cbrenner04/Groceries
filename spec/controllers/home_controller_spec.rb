# frozen_string_literal: true
require "rails_helper"

RSpec.describe HomeController, type: :controller do
  let(:user) { create :user }

  before { sign_in user }

  describe "GET #show" do
    it "is successful" do
      get :show

      expect(response).to have_http_status(:success)
    end
  end
end
