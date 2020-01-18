# frozen_string_literal: true

require "rails_helper"

RSpec.describe BookListItem, type: :model do
  let(:item) { create :book_list_item, title: "foo", author: "a" }
  let(:second_item) do
    create :book_list_item, title: "bar", number_in_series: 1, author: "a"
  end
  let(:third_item) do
    create :book_list_item, title: "foo", number_in_series: 2, author: "a"
  end
  let(:fourth_item) do
    create :book_list_item, title: "baz", number_in_series: 2, author: "a"
  end
  let(:fifth_item) { create :book_list_item, title: "foo", author: "b" }

  describe "validations" do
    it { expect(item).to be_valid }

    it "is invalid when user is blank" do
      item.user = nil
      expect(item).not_to be_valid
    end

    it "is invalid when author and title is blank" do
      item.author = nil
      item.title = nil
      expect(item).not_to be_valid
    end

    it "is valid when author is blank" do
      item.author = nil
      expect(item).to be_valid
    end

    it "is valid when title is blank" do
      item.title = nil
      expect(item).to be_valid
    end

    it "is invalid when purchased is blank" do
      item.purchased = nil
      expect(item).not_to be_valid
    end

    it "is invalid when read is blank" do
      item.read = nil
      expect(item).not_to be_valid
    end
  end

  describe ".ordered" do
    it "returns items ordered by author then number_in_series then title" do
      expect(BookListItem.ordered).to eq [
        second_item,
        fourth_item,
        third_item,
        item,
        fifth_item
      ]
    end
  end

  describe "#archive" do
    it "archives item" do
      expect(item.archived_at).to be_nil
      item.archive
      expect(item.archived_at).not_to be_nil
    end
  end
end
