# frozen_string_literal: true
require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    let(:user) { create :user }

    it "is valid" do
      expect(user).to be_valid
    end

    it "is invalid without first_name" do
      user.first_name = nil

      expect(user).to_not be_valid
    end

    it "is invalid without email" do
      user.email = nil

      expect(user).to_not be_valid
    end
  end
end
