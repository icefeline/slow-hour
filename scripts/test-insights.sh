#!/bin/bash

# Test different card + transit combinations to see insight quality

echo "=========================================="
echo "SAMPLE INSIGHT TESTS"
echo "=========================================="
echo ""

# Helper function to test a card
test_card() {
  local card_id="$1"
  local label="$2"

  echo "----------------------------------------"
  echo "TEST: $label"
  echo "Card: $card_id"
  echo "----------------------------------------"

  # Get a card from the API (using a fixed seed for reproducibility)
  # This will trigger insight generation
  echo ""
}

# Run tests
test_card "major-16" "The Tower - Upheaval & Breaking Down"
test_card "swords-3" "Three of Swords - Heartbreak & Pain"
test_card "major-17" "The Star - Hope & Healing"
test_card "cups-2" "Two of Cups - Connection & Partnership"
test_card "pentacles-8" "Eight of Pentacles - Dedication & Mastery"

echo ""
echo "=========================================="
