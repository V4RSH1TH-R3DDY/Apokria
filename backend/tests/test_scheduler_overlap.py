"""
Unit tests for SchedulerAgent overlap detection logic.
Tests various time slot overlap scenarios to ensure accurate conflict detection.
"""

import unittest
import pytest
from datetime import datetime, timezone, timedelta
from backend.agents.scheduler import SchedulerAgent, TimeSlot, ConflictResult

class TestTimeSlotOverlap(unittest.TestCase):
    """Test time slot overlap detection logic"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.scheduler = SchedulerAgent()
        
        # Base test time (2025-11-08 10:00 UTC)
        self.base_time = datetime(2025, 11, 8, 10, 0, 0, tzinfo=timezone.utc)
        
        # Common test time slots
        self.slot_10_to_12 = TimeSlot(
            start_time=self.base_time,
            end_time=self.base_time + timedelta(hours=2),
            venue="Room A"
        )
        
        self.slot_11_to_13 = TimeSlot(
            start_time=self.base_time + timedelta(hours=1),
            end_time=self.base_time + timedelta(hours=3),
            venue="Room A"
        )
        
        self.slot_12_to_14 = TimeSlot(
            start_time=self.base_time + timedelta(hours=2),
            end_time=self.base_time + timedelta(hours=4),
            venue="Room A"
        )
        
        self.slot_14_to_16 = TimeSlot(
            start_time=self.base_time + timedelta(hours=4),
            end_time=self.base_time + timedelta(hours=6),
            venue="Room A"
        )

    def test_no_overlap_before(self):
        """Test slots that don't overlap - second slot starts after first ends"""
        result = self.scheduler.check_time_overlap(self.slot_10_to_12, self.slot_14_to_16)
        self.assertFalse(result, "Slots that don't overlap should return False")

    def test_no_overlap_after(self):
        """Test slots that don't overlap - first slot starts after second ends"""
        result = self.scheduler.check_time_overlap(self.slot_14_to_16, self.slot_10_to_12)
        self.assertFalse(result, "Slots that don't overlap should return False")

    def test_exact_touch_no_overlap(self):
        """Test slots that touch exactly at boundaries - should not overlap"""
        result = self.scheduler.check_time_overlap(self.slot_10_to_12, self.slot_12_to_14)
        self.assertFalse(result, "Slots that touch exactly should not overlap")

    def test_partial_overlap(self):
        """Test slots that partially overlap"""
        result = self.scheduler.check_time_overlap(self.slot_10_to_12, self.slot_11_to_13)
        self.assertTrue(result, "Partially overlapping slots should return True")

    def test_complete_overlap(self):
        """Test when one slot completely contains another"""
        slot_9_to_15 = TimeSlot(
            start_time=self.base_time - timedelta(hours=1),
            end_time=self.base_time + timedelta(hours=5),
            venue="Room A"
        )
        result = self.scheduler.check_time_overlap(slot_9_to_15, self.slot_10_to_12)
        self.assertTrue(result, "Completely overlapping slots should return True")

    def test_same_start_different_end(self):
        """Test slots with same start time but different end times"""
        slot_10_to_11 = TimeSlot(
            start_time=self.base_time,
            end_time=self.base_time + timedelta(hours=1),
            venue="Room A"
        )
        result = self.scheduler.check_time_overlap(self.slot_10_to_12, slot_10_to_11)
        self.assertTrue(result, "Slots with same start time should overlap")

    def test_same_end_different_start(self):
        """Test slots with same end time but different start times"""
        slot_11_to_12 = TimeSlot(
            start_time=self.base_time + timedelta(hours=1),
            end_time=self.base_time + timedelta(hours=2),
            venue="Room A"
        )
        result = self.scheduler.check_time_overlap(self.slot_10_to_12, slot_11_to_12)
        self.assertTrue(result, "Slots with same end time should overlap")

    def test_different_venues_no_overlap_required(self):
        """Test that different venues can have overlapping times"""
        slot_room_b = TimeSlot(
            start_time=self.base_time,
            end_time=self.base_time + timedelta(hours=2),
            venue="Room B"
        )
        # This depends on implementation - you might want different venues to not conflict
        result = self.scheduler.check_time_overlap(self.slot_10_to_12, slot_room_b)
        # This test assumes different venues can overlap - adjust based on business logic
        self.assertTrue(result, "Current implementation treats all overlaps as conflicts")

    def test_none_venue_handling(self):
        """Test handling of None venue values"""
        slot_no_venue = TimeSlot(
            start_time=self.base_time,
            end_time=self.base_time + timedelta(hours=2),
            venue=None
        )
        result = self.scheduler.check_time_overlap(self.slot_10_to_12, slot_no_venue)
        self.assertTrue(result, "Should handle None venue gracefully")

class TestTimeSlotValidation(unittest.TestCase):
    """Test TimeSlot validation logic"""
    
    def test_valid_time_slot(self):
        """Test creating a valid time slot"""
        start = datetime(2025, 11, 8, 10, 0, 0, tzinfo=timezone.utc)
        end = datetime(2025, 11, 8, 12, 0, 0, tzinfo=timezone.utc)
        
        slot = TimeSlot(start_time=start, end_time=end, venue="Room A")
        self.assertEqual(slot.start_time, start)
        self.assertEqual(slot.end_time, end)
        self.assertEqual(slot.venue, "Room A")

    def test_invalid_time_slot_start_after_end(self):
        """Test that start time after end time raises ValueError"""
        start = datetime(2025, 11, 8, 12, 0, 0, tzinfo=timezone.utc)
        end = datetime(2025, 11, 8, 10, 0, 0, tzinfo=timezone.utc)
        
        with self.assertRaises(ValueError) as context:
            TimeSlot(start_time=start, end_time=end)
        
        self.assertIn("Start time must be before end time", str(context.exception))

    def test_invalid_time_slot_same_start_end(self):
        """Test that same start and end time raises ValueError"""
        same_time = datetime(2025, 11, 8, 10, 0, 0, tzinfo=timezone.utc)
        
        with self.assertRaises(ValueError) as context:
            TimeSlot(start_time=same_time, end_time=same_time)
        
        self.assertIn("Start time must be before end time", str(context.exception))

    def test_timezone_awareness_added(self):
        """Test that timezone awareness is added to naive datetimes"""
        # Create naive datetime (no timezone)
        start_naive = datetime(2025, 11, 8, 10, 0, 0)
        end_naive = datetime(2025, 11, 8, 12, 0, 0)
        
        slot = TimeSlot(start_time=start_naive, end_time=end_naive)
        
        # Should have timezone added
        self.assertIsNotNone(slot.start_time.tzinfo)
        self.assertIsNotNone(slot.end_time.tzinfo)
        self.assertEqual(slot.start_time.tzinfo, timezone.utc)
        self.assertEqual(slot.end_time.tzinfo, timezone.utc)

class TestSchedulerAgentDateTimeParsing(unittest.TestCase):
    """Test datetime parsing functionality"""
    
    def setUp(self):
        self.scheduler = SchedulerAgent()

    def test_parse_iso_format(self):
        """Test parsing ISO format datetime strings"""
        iso_string = "2025-11-08T10:00:00Z"
        parsed = self.scheduler.parse_datetime(iso_string)
        
        expected = datetime(2025, 11, 8, 10, 0, 0, tzinfo=timezone.utc)
        self.assertEqual(parsed, expected)

    def test_parse_iso_format_with_offset(self):
        """Test parsing ISO format with timezone offset"""
        iso_string = "2025-11-08T10:00:00+05:30"
        parsed = self.scheduler.parse_datetime(iso_string)
        
        # Should be parsed with the specified timezone
        self.assertIsNotNone(parsed.tzinfo)
        self.assertEqual(parsed.hour, 10)  # Hour should remain 10 in the specified timezone

    def test_parse_invalid_format(self):
        """Test parsing invalid datetime format"""
        invalid_string = "not-a-datetime"
        
        with self.assertRaises(ValueError) as context:
            self.scheduler.parse_datetime(invalid_string)
        
        self.assertIn("Invalid datetime format", str(context.exception))

    def test_parse_datetime_object(self):
        """Test parsing datetime object (should return as-is with timezone)"""
        dt_naive = datetime(2025, 11, 8, 10, 0, 0)
        parsed = self.scheduler.parse_datetime(dt_naive)
        
        # Should add UTC timezone to naive datetime
        self.assertIsNotNone(parsed.tzinfo)
        self.assertEqual(parsed.tzinfo, timezone.utc)

if __name__ == '__main__':
    # Run the tests
    unittest.main(verbosity=2)