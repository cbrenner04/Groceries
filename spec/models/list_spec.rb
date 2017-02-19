# frozen_string_literal: true
require "rails_helper"

RSpec.describe List do
  describe "validations" do
    let(:list) { create :list }

    it { expect(list).to be_valid }

    it "is invalid without name" do
      list.name = nil

      expect(list).to_not be_valid
    end
  end
end
