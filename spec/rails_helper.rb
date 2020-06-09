# frozen_string_literal: true

require "simplecov"
SimpleCov.start "rails" do
  add_filter "app/models/item.rb"
end
SimpleCov.minimum_coverage 90
SimpleCov.minimum_coverage_by_file 80

ENV["RAILS_ENV"] ||= "test"
require File.expand_path("../config/environment", __dir__)

abort("The Rails environment is running in production") if Rails.env.production?
require "spec_helper"
require "rspec/rails"
require "capybara/rails"
require "factory_bot_rails"
require "capybara/poltergeist"
Capybara.javascript_driver = :poltergeist
Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, js_errors: false)
end

require_relative "./helpers/authentication_helper"

Warden.test_mode!

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  include Warden::Test::Helpers
  include AuthenticationHelper

  # Ensure that if we are running js tests, we are using latest webpack assets
  # This will use the defaults of :js and :server_rendering meta tags
  ReactOnRails::TestHelper.configure_rspec_to_compile_assets(config)

  config.example_status_persistence_file_path = "spec/examples.txt"

  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = false
  config.before(:suite) { DatabaseCleaner.clean_with(:truncation) }
  config.before { DatabaseCleaner.strategy = :transaction }
  config.before(:each, js: true) { DatabaseCleaner.strategy = :truncation }
  config.before { DatabaseCleaner.start }
  config.after { DatabaseCleaner.clean }
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
  config.include FactoryBot::Syntax::Methods
  # config.include Devise::Test::ControllerHelpers, type: :controller
  config.include Devise::Test::ControllerHelpers, type: :view

  config.after do
    page.driver.restart if defined?(page.driver.restart)
  end
end
