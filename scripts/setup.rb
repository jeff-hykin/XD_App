require 'atk_toolbox'

puts "I'll try to install most of these things for you"
puts "to test/build you'll need:"
puts "    nodejs ≥ v13.7.0"
puts "    npm ≥ 6.13.6"
puts ""

puts "\nattempting to install node and npm"
if not Console.has_command("npm")
    if OS.is?("mac")
        system "brew install node"
    elsif OS.is?("windows")
        system "scoop install nodejs"
    elsif OS.is?("ubuntu")
        system "sudo apt install nodejs"
    end
end

system "npm install"