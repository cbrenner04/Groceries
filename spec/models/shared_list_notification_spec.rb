# frozen_string_literal: true

require "rails_helper"

RSpec.describe SharedListNotification do
  let(:sharer) { create :user }
  let(:sharee) { create :user }

  describe ".send_notification_for" do
    it "calls SharedListNotificationMailer" do
      expect(SharedListNotificationMailer)
        .to receive_message_chain(:notify, :deliver_now)
      SharedListNotification.send_notification_for(sharer, sharee.id)
    end
  end
end
