Rails.application.routes.draw do
  devise_for :users
  resources :lists
  root to: "home#show"
end
