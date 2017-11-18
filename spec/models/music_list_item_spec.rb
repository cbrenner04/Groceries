# frozen_string_literal: true

require "rails_helper"

RSpec.describe MusicListItem, type: :model do
  let(:item) { create :music_list_item, title: "foo" }
  let(:another_item) do
    create :music_list_item, title: "bar", created_at: Time.zone.now - 1.day
  end

  describe "validations" do
    it { expect(item).to be_valid }

    it "is invalid when user is blank" do
      item.user = nil
      expect(item).to_not be_valid
    end

    it "is invalid when title, artist, and album are blank" do
      item.title = nil
      item.artist = nil
      item.album = nil
      expect(item).to_not be_valid
    end

    it "is valid when title is blank" do
      item.title = nil
      expect(item).to be_valid
    end

    it "is valid when album is blank" do
      item.album = nil
      expect(item).to be_valid
    end

    it "is valid when artist is blank" do
      item.artist = nil
      expect(item).to be_valid
    end

    it "is invalid when purchased is blank" do
      item.purchased = nil
      expect(item).to_not be_valid
    end
  end

  describe ".ordered" do
    it "returns items ordered by created at" do
      expect(MusicListItem.ordered).to eq [another_item, item]
    end
  end

  describe "#archive" do
    it "archives item" do
      expect(item.archived_at).to be_nil
      item.archive
      expect(item.archived_at).to_not be_nil
    end
  end
end
