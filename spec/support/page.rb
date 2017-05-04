# frozen_string_literal: true

class Page
  include Capybara::DSL
  include Rails.application.routes.url_helpers
end
