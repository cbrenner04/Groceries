# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem "coffee-rails", "~> 4.2", ">= 4.2.2"
gem "jbuilder", "~> 2.7"
gem "jquery-rails"
gem "pg", "~> 1.0"
gem "puma", "~> 3.11", ">= 3.11.4"
gem "rails", "~> 5.2"
gem "sass-rails", "~> 5.0", ">= 5.0.7"
gem "turbolinks", "~> 5.1", ">= 5.1.1"
gem "uglifier", "~> 4.1", ">= 4.1.11"

group :production do
  gem "informant-rails", "~> 1.1"
  # heroku
  gem "rails_12factor"
end

group :development, :test do
  gem "bundler-audit", "~> 0.6.0"
  gem "byebug", platform: :mri
  gem "capybara", "~> 3.2"
  gem "database_cleaner", "~> 1.7"
  gem "rspec-rails", "~> 3.7", ">= 3.7.2"
end

group :development do
  gem "factory_bot_rails", "~> 4.10"
  gem "listen", "~> 3.1", ">= 3.1.5"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0", ">= 2.0.1"
  gem "web-console", "~> 3.6", ">= 3.6.2"
end

# add-ons
gem "bootstrap", "~> 4.1", ">= 4.1.1"
source "https://rails-assets.org" do
  # In combination with Bootstrap
  gem "rails-assets-tether", "~> 1.1", ">= 1.1.1"
end
gem "devise", "~> 4.4", ">= 4.4.3"
gem "devise_invitable", "~> 1.7", ">= 1.7.4"
gem "font-awesome-rails", "~> 4.7", ">= 4.7.0.4"
gem "launchy", "~> 2.4", ">= 2.4.3"
gem "mini_racer", platforms: :ruby
gem "newrelic_rpm", "~> 5.1", ">= 5.1.0.344"
gem "poltergeist", "~> 1.18", ">= 1.18.1"
gem "rails-controller-testing", "~> 1.0", ">= 1.0.2"
gem "rails-erd", "~> 1.5", ">= 1.5.2"
gem "rails_real_favicon", "~> 0.0.11"
gem "react_on_rails", "~> 8.0", ">= 8.0.3"
gem "rubocop", "~> 0.56.0", require: false
gem "sentry-raven", "~> 2.7", ">= 2.7.3"
gem "simplecov", "~> 0.16.1"
gem "webpacker_lite"
# error bundling on heroku fixed adding line below
gem "libv8", "~> 5.3", ">= 5.3.332.38.5"

ruby "2.5.1"
