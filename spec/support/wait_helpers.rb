# frozen_string_literal: true

module WaitHelpers
  def wait_for
    @counter ||= 0
    until yield || wait_time_lapsed?
      sleep 1
      @counter += 1
    end
  end

  def wait_time_lapsed?
    @counter > Capybara.default_max_wait_time
  end
end
