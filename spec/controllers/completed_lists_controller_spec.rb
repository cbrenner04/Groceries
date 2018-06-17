# frozen_string_literal: true

require "rails_helper"

RSpec.describe CompletedListsController do
  let(:user) { create :user_with_lists }

  before { sign_in user }

  describe "GET #index" do
    describe "format HTML" do
      it "renders index" do
        get :index

        expect(response).to render_template :index
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :index, format: :json

        response_body = JSON.parse(response.body)
        expect(response).to be_successful
        expect(response_body["completed_lists"].count)
          .to eq List.all_completed_lists(user).count
      end
    end
  end
end
