# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem "bootstrap", "~> 4.3", ">= 4.3.1"
gem "coffee-rails", "~> 4.2", ">= 4.2.2"
gem "devise", "~> 4.6", ">= 4.6.2"
gem "devise_invitable", "~> 1.7", ">= 1.7.5"
gem "font-awesome-rails", "~> 4.7", ">= 4.7.0.5"
gem "jbuilder", "~> 2.7"
gem "jquery-rails", ">= 4.3.5"
# error bundling on heroku fixed adding line below
gem "libv8", "~> 5.3", ">= 5.3.332.38.5"
gem "mini_racer", platforms: :ruby
gem "newrelic_rpm", "~> 5.1", ">= 5.1.0.344"
gem "pg", "~> 1.0"
gem "puma", "~> 3.11", ">= 3.11.4"
gem "rails", "~> 5.2", ">= 5.2.3"
source "https://rails-assets.org" do
  # In combination with Bootstrap
  gem "rails-assets-tether", "~> 1.1", ">= 1.1.1"
end
gem "rails-controller-testing", "~> 1.0", ">= 1.0.4"
gem "rails_real_favicon", "~> 0.0.12"
gem "react_on_rails", "~> 8.0", ">= 8.0.6"
gem "sass-rails", "~> 5.0", ">= 5.0.7"
gem "sentry-raven", "~> 2.7", ">= 2.7.3"
gem "turbolinks", "~> 5.1", ">= 5.1.1"
gem "uglifier", "~> 4.1", ">= 4.1.11"
gem "webpacker_lite", ">= 2.1.0"

group :production do
  gem "informant-rails", "~> 1.1", ">= 1.1.0"
  # heroku
  gem "rails_12factor"
end

group :development, :test do
  gem "bundler-audit", "~> 0.6.0"
  gem "byebug", platform: :mri
  gem "capybara", "~> 3.25", ">= 3.25.0"
  gem "database_cleaner", "~> 1.7"
  gem "launchy", "~> 2.4", ">= 2.4.3"
  gem "poltergeist", "~> 1.18", ">= 1.18.1"
  gem "rspec-rails", "~> 3.8", ">= 3.8.2"
  gem "rubocop", "~> 0.60.0", require: false
  gem "rubocop-rspec", "~> 1.33"
  gem "simplecov", "~> 0.16.1"
end

group :development do
  gem "derailed", "~> 0.1.0"
  gem "factory_bot_rails", "~> 4.11", ">= 4.11.1"
  gem "listen", "~> 3.1", ">= 3.1.5"
  gem "rails-erd", "~> 1.5", ">= 1.5.2"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0", ">= 2.0.1"
  gem "web-console", "~> 3.7", ">= 3.7.0"
end

ruby "2.5.1"
