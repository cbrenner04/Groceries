# frozen_string_literal: true
source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem "coffee-rails", "~> 4.2"
gem "jbuilder", "~> 2.5"
gem "jquery-rails"
gem "pg", "~> 0.18"
gem "puma", "~> 3.0"
gem "rails", "~> 5.0.1"
gem "sass-rails", "~> 5.0"
gem "turbolinks", "~> 5"
gem "uglifier", ">= 1.3.0"

group :development, :test do
  gem "byebug", platform: :mri
  gem "capybara", "~> 2.12.0"
  gem "database_cleaner", "~> 1.5"
  gem "rspec-rails", "~> 3.5.2"
end

group :development do
  gem "factory_girl_rails", "~> 4.8"
  gem "listen", "~> 3.0.5"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
  gem "web-console", ">= 3.3.0"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# add-ons
gem "bootstrap", "~> 4.0.0.alpha6"
gem "devise", "~> 4.2"
gem "font-awesome-rails", "~> 4.7", ">= 4.7.0.1"
gem "launchy", "~> 2.4", ">= 2.4.3"
gem "rails-controller-testing", "~> 1.0", ">= 1.0.1"
gem "rubocop", "~> 0.46.0", require: false
gem "simplecov", "~> 0.13.0"

# heroku
gem "rails_12factor", group: :production
ruby "2.3.0"
