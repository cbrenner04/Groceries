# frozen_string_literal: true

require "rails_helper"

RSpec.describe SharedListNotificationMailer, type: :mailer do
  let(:host) { "groceries-app.com" }
  let(:sharee_email) { "sharee.email@example.com" }
  let(:sharer_email) { "sharer.email@example.com" }

  before do
    Rails.configuration.action_mailer.default_url_options[:host] = host
  end

  describe "srm reminder email" do
    let(:mail) do
      SharedListNotificationMailer.notify(sharer_email, sharee_email)
    end

    it "sets 'subject'" do
      expect(mail.subject).to eq "A list has been shared with you!"
    end

    it "sets 'to' as sharee's email" do
      expect(mail.to).to eq [sharee_email]
    end

    it "sets 'from' as default" do
      expect(mail.from).to eq ["no-reply@groceries-app.com"]
    end

    it "renders a link to access SRM entry" do
      expect(mail.body.encoded).to have_link "Groceries"
    end

    it "reports the participant and mood rating" do
      expect(mail.body.encoded)
        .to include "#{@sharer_email} has shared a list with you."
    end
  end
end
